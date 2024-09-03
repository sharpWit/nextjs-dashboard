import { Metadata } from "next";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";

export const metadata: Metadata = {
  title: "Edit",
};

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Invoice?select=*`,
      {
        headers: {
          apikey: `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Invoice IDs not fetched");
    }

    const invoiceIDs = await res.json();

    return invoiceIDs.map((invoice: any) => ({
      id: invoice.id.toString(),
    }));
  } catch (error) {
    console.error("ERROR:", error);
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id ?? {};

  const [invoice, customers] = await Promise.all([
    await prisma.invoice.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        customerId: true,
        amount: true,
        status: true,
      },
    }),

    await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
