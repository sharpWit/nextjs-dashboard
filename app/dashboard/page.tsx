import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import prisma from "../lib/prisma";
import { formatCurrency } from "../lib/utils";

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
  // console.log("REVENUE: ", revenue);
  // console.log("invoices: ", invoices);
  // console.log("latestInvoices: ", latestInvoices);

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> */}
        {/* <Card title="Pending" value={totalPendingInvoices} type="pending" /> */}
        {/* <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
        {/* <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}
