import { Metadata } from "next";
import prisma from "@/app/lib/prisma";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import CreateInvoiceForm from "@/app/ui/invoices/create-form";

export const metadata: Metadata = {
  title: "Create",
};

export default async function Page() {
  const customers = await prisma.customer.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Create Invoice",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      />
      <CreateInvoiceForm customers={customers} />
    </main>
  );
}
