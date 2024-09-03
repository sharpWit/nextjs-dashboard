import { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import prisma from "@/app/lib/prisma";
import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";

export const metadata: Metadata = {
  title: "Edit",
};

const getData = unstable_cache(async (id: string) => {
  const res = await Promise.all([
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

  return res;
});

export const generateStaticParams = async () => {
  const invoices = await prisma.invoice.findMany({
    select: { id: true },
  });
  return invoices.map((invoice) => ({
    id: invoice.id.toString(),
  }));
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id ?? {};
  const [invoice, customers] = await getData(id);

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
      <Form invoice={invoice} customers={customers ?? []} />
    </main>
  );
}
