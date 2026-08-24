import { useState } from "react";
import { Download, Image as ImageIcon, Printer, Search } from "lucide-react";
import { ReportsAPI } from "../../services/resources.js";
import { formatDateShort, todayISODate } from "../../utils/format.js";
import { getErrorMessage } from "../../services/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import { exportElementAsPDF, exportElementAsImage } from "../../utils/exportReport.js";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import ReportDocument from "../../components/reports/ReportDocument.jsx";

const monthAgoISO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
};

export default function RangeReport() {
  const [from, setFrom] = useState(monthAgoISO());
  const [to, setTo] = useState(todayISODate());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();

  const runReport = async () => {
    setLoading(true);
    try {
      const res = await ReportsAPI.range(from, to);
      setData(res.data);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportElementAsPDF("printable-report", `Range-Report-${from}-to-${to}.pdf`);
      showToast("Report generated successfully.");
    } catch { showToast("Unable to generate PDF.", "error"); } finally { setExporting(false); }
  };

  const handleExportImage = async (type) => {
    setExporting(true);
    try {
      await exportElementAsImage("printable-report", `Range-Report-${from}-to-${to}.${type}`, type);
      showToast("Report generated successfully.");
    } catch { showToast("Unable to generate image.", "error"); } finally { setExporting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="no-print">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Date Range Report</h1>
        <p className="text-ink-800/60 text-sm mb-4">View combined production and expenses across a custom date range.</p>

        <Card className="p-4 flex flex-wrap items-end gap-3">
          <Input label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          <Button icon={Search} onClick={runReport} loading={loading}>Generate Report</Button>
          {data && (
            <div className="flex gap-2 ml-auto">
              <Button variant="secondary" icon={Printer} onClick={() => window.print()}>Print</Button>
              <Button variant="secondary" icon={ImageIcon} onClick={() => handleExportImage("png")} loading={exporting}>Image</Button>
              <Button icon={Download} onClick={handleExportPDF} loading={exporting}>Export PDF</Button>
            </div>
          )}
        </Card>
      </div>

      {loading && <Spinner />}

      {data && !loading && (
        <Card className="overflow-hidden">
          <ReportDocument
            title="Date Range Report"
            subtitle={`From ${formatDateShort(from)} to ${formatDateShort(to)}`}
            data={data}
          />
        </Card>
      )}
    </div>
  );
}
