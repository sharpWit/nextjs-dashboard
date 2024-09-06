import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/app/lib/prisma";
import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";

export const metadata: Metadata = {
  title: "Edit",
};

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 3600; // invalidate every hour
export const dynamic = "force-static";
// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
// export const dynamicParams = true; // or false, to 404 on unknown paths

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

  const getData = async (id: string) => {
    return await Promise.all([
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
  };

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
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
