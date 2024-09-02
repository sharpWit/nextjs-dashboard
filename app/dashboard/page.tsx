import prisma from "@/app/lib/prisma";
import { lusitana } from "@/app/ui/fonts";
import { Card } from "@/app/ui/dashboard/cards";
import { formatCurrency } from "@/app/lib/utils";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";

export default async function Page() {
  const revenue = await prisma.revenue.findMany();
  const invoices = await prisma.invoice.findMany({
    select: {
      id: true,
      amount: true,
      date: true,
      customer: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
    take: 5,
  });
  const latestInvoices = invoices.map((invoice) => ({
    ...invoice,
    amount: formatCurrency(invoice.amount),
  }));

  const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
    prisma.invoice.count(),
    prisma.customer.count(),
    prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
      where: {
        OR: [{ status: "paid" }, { status: "pending" }],
      },
    }),
  ]);

  const numberOfInvoices = invoiceCount;
  const numberOfCustomers = customerCount;
  const totalPaidInvoices = formatCurrency(invoiceStatus._sum.amount || 0);
  const totalPendingInvoices = formatCurrency(invoiceStatus._sum.amount || 0);

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}
