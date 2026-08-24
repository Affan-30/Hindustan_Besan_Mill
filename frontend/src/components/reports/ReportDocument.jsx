import { formatCurrency, formatDateDisplay, formatDateShort, formatKg } from "../../utils/format.js";

// Shared printable report layout used by Daily / Range / Monthly report pages.
// Renders as a clean A4-style document — this is the exact node captured for PDF/image export.
export default function ReportDocument({ title, subtitle, data }) {
  const totals = data?.totals || {};
  const productionEntries = data?.production || [];
  // Only hide the per-row date when every entry is for the same single day
  // (the Daily Report) — a range/monthly report needs the date to tell entries apart.
  const isSingleDay = productionEntries.every(
    (p) => p.date && productionEntries[0]?.date && new Date(p.date).toDateString() === new Date(productionEntries[0].date).toDateString()
  );

  return (
    <div id="printable-report" className="bg-white text-ink-900 p-6 sm:p-10 max-w-[820px] mx-auto">
      <div className="text-center border-b-2 border-ink-900 pb-4 mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-wide">HINDUSTAN BESAN MILL</h1>
        <p className="text-sm text-ink-800/70 mt-1">{title}</p>
        <p className="text-sm font-semibold text-ink-800 mt-1">{subtitle}</p>
      </div>

<Section title="Production Summary">
  {productionEntries.length ? (
    <div className="w-full overflow-x-auto lg:overflow-x-visible">
      <table className="w-full min-w-[900px] lg:min-w-0 text-sm border-collapse">
        <thead>
          <tr className="border-b border-ink-900/20 text-left">
            {!isSingleDay && (
              <th className="py-1.5">Date</th>
            )}

            <th className="py-1.5">Dal Category</th>

            <th className="py-1.5">
              Besan Bags
            </th>

            <th className="py-1.5 text-right p-5">
              Besan
            </th>

            <th className="py-1.5">
              Jada Besan Bags
            </th>

            <th className="py-1.5 text-right p-3">
              Jada Besan
            </th>

            <th className="py-1.5">
              Chunni Bags
            </th>

            <th className="py-1.5 text-right">
              Chunni
            </th>
          </tr>
        </thead>

        <tbody>
          {productionEntries.map((p) => (
            <tr
              key={p._id}
              className="border-b border-ink-900/10"
            >
              {!isSingleDay && (
                <td className="py-1.5">
                  {formatDateShort(p.date)}
                </td>
              )}

              <td className="py-1.5 font-medium">
                {p.dalCategory}
              </td>

              <td className="py-1.5 text-ink-800/60">
                {p.besanBags10Kg || 0} × 10kg,{" "}
                {p.besanBags30Kg || 0} × 30kg
              </td>

              <td className="py-1.5 text-right p-3">
                {formatKg(p.totalBesanKg)}
              </td>

              <td className="py-1.5 text-ink-800/60 p-5">
                {p.jadaBesanBags50Kg || 0} × 50kg
              </td>

              <td className="py-1.5 text-right p-6">
                {formatKg(p.jadaBesanKg)}
              </td>

              <td className="py-1.5 text-ink-800/60 p-4">
                {p.chunniBags50Kg || 0} × 50kg
              </td>

              <td className="py-1.5 text-right">
                {formatKg(p.chunniKg)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyLine text="No production recorded." />
  )}
</Section>


      <Section title="Worker Payments">
        {data.workerPayments?.length ? (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-ink-900/20 text-left">
                <th className="py-1.5">Worker</th>
                <th className="py-1.5">Type</th>
                <th className="py-1.5">Method</th>
                <th className="py-1.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.workerPayments.map((p) => (
                <tr key={p._id} className="border-b border-ink-900/10">
                  <td className="py-1.5">{p.workerNameSnapshot}</td>
                  <td className="py-1.5">{p.paymentType}</td>
                  <td className="py-1.5">{p.paymentMethod}</td>
                  <td className="py-1.5 text-right">{formatCurrency(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyLine text="No worker payments recorded." />
        )}
        <TotalLine label="Total Worker Payments" value={totals.totalWorkerPayments} />
      </Section>

      <Section title="Other Payments">
        {data.otherPayments?.length ? (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-ink-900/20 text-left">
                <th className="py-1.5">Category</th>
                <th className="py-1.5">Paid To</th>
                <th className="py-1.5">Method</th>
                <th className="py-1.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.otherPayments.map((p) => (
                <tr key={p._id} className="border-b border-ink-900/10">
                  <td className="py-1.5">{p.category}</td>
                  <td className="py-1.5">{p.paidTo}</td>
                  <td className="py-1.5">{p.paymentMethod}</td>
                  <td className="py-1.5 text-right">{formatCurrency(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyLine text="No other payments recorded." />
        )}
        <TotalLine label="Total Other Payments" value={totals.totalOtherPayments} />
      </Section>

      <Section title="Raw Material Purchases">
        {data.rawMaterials?.length ? (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-ink-900/20 text-left">
                <th className="py-1.5">Material</th>
                <th className="py-1.5">Supplier</th>
                <th className="py-1.5 text-right">Quantity</th>
                <th className="py-1.5 text-right">Rate</th>
                <th className="py-1.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.rawMaterials.map((p) => (
                <tr key={p._id} className="border-b border-ink-900/10">
                  <td className="py-1.5">{p.material}</td>
                  <td className="py-1.5">{p.supplierNameSnapshot}</td>
                  <td className="py-1.5 text-right">{p.quantity} {p.unit}</td>
                  <td className="py-1.5 text-right">{formatCurrency(p.rate)}</td>
                  <td className="py-1.5 text-right">{formatCurrency(p.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyLine text="No raw material purchases recorded." />
        )}
        <TotalLine label="Total Raw Material Purchase" value={totals.totalRawMaterialPurchases} />
      </Section>

      <Section title="Bill Payments">
        {data.bills?.length ? (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-ink-900/20 text-left">
                <th className="py-1.5">Bill Type</th>
                <th className="py-1.5">Description</th>
                <th className="py-1.5">Method</th>
                <th className="py-1.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.bills.map((p) => (
                <tr key={p._id} className="border-b border-ink-900/10">
                  <td className="py-1.5">{p.billType}</td>
                  <td className="py-1.5">{p.description}</td>
                  <td className="py-1.5">{p.paymentMethod}</td>
                  <td className="py-1.5 text-right">{formatCurrency(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyLine text="No bills recorded." />
        )}
        <TotalLine label="Total Bill Payments" value={totals.totalBillPayments} />
      </Section>

      <div className="mt-6 border-2 border-ink-900 rounded-lg p-4 bg-wheat-50">
        <div className="flex justify-between items-center">
          <span className="font-display font-bold text-lg">TOTAL DAILY EXPENSE</span>
          <span className="font-display font-bold text-2xl">{formatCurrency(totals.totalDailyExpenses)}</span>
        </div>
      </div>

      {/* SALES / PAYMENT RECEIVED — money coming in. Kept separate from expenses above. */}
      <div className="mt-8">
        <Section title="Sell (Payment Received)">
          {data.sales?.length ? (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-ink-900/20 text-left">
                  <th className="py-1.5">Party</th>
                  <th className="py-1.5">Reference No.</th>
                  <th className="py-1.5">Method</th>
                  <th className="py-1.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.sales.map((p) => (
                  <tr key={p._id} className="border-b border-ink-900/10">
                    <td className="py-1.5">{p.partyName}</td>
                    <td className="py-1.5">{p.referenceNumber}</td>
                    <td className="py-1.5">{p.paymentMethod}</td>
                    <td className="py-1.5 text-right">{formatCurrency(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyLine text="No payments received recorded." />
          )}
        </Section>

        <div className="border-2 border-leaf-600 rounded-lg p-4 bg-leaf-500/5">
          <div className="flex justify-between items-center">
            <span className="font-display font-bold text-lg">TOTAL SALES (MONEY IN)</span>
            <span className="font-display font-bold text-2xl text-leaf-600">{formatCurrency(totals.totalSales)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center px-1 text-sm">
        <span className="font-semibold text-ink-800/70">Net Position for the day (Sales − Expenses)</span>
        <span className={`font-display font-bold text-lg ${((totals.totalSales || 0) - (totals.totalDailyExpenses || 0)) >= 0 ? "text-leaf-600" : "text-brick-600"}`}>
          {formatCurrency((totals.totalSales || 0) - (totals.totalDailyExpenses || 0))}
        </span>
      </div>

      <div className="text-center text-xs text-ink-800/50 mt-8 pt-4 border-t border-ink-900/10">
        Generated by Hindustan Besan Mill Management System
      </div>
    </div>
  );
}

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="font-display font-semibold text-base mb-2 border-b border-ink-900/10 pb-1">{title}</h2>
    {children}
  </div>
);

const TotalLine = ({ label, value }) => (
  <div className="flex justify-between text-sm font-semibold mt-2 pt-2 border-t border-ink-900/10">
    <span>{label}</span>
    <span>{formatCurrency(value)}</span>
  </div>
);

const EmptyLine = ({ text }) => <p className="text-sm text-ink-800/50 italic py-2">{text}</p>;