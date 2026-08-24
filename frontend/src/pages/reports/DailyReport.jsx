import { useEffect, useState } from "react";
import { Download, Image as ImageIcon, Printer } from "lucide-react";
import { ReportsAPI } from "../../services/resources.js";
import { formatDateDisplay, todayISODate, formatDateShort } from "../../utils/format.js";
import { getErrorMessage } from "../../services/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import { exportElementAsPDF, exportElementAsImage } from "../../utils/exportReport.js";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import ReportDocument from "../../components/reports/ReportDocument.jsx";

export default function DailyReport() {
  const [date, setDate] = useState(todayISODate());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    ReportsAPI.daily(date)
      .then((res) => setData(res.data))
      .catch((err) => showToast(getErrorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [date]);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportElementAsPDF("printable-report", `Daily-Report-${date}.pdf`);
      showToast("Report generated successfully.");
    } catch (err) {
      showToast("Unable to generate PDF. Please try again.", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleExportImage = async (type) => {
    setExporting(true);
    try {
      await exportElementAsImage("printable-report", `Daily-Report-${date}.${type}`, type);
      showToast("Report generated successfully.");
    } catch (err) {
      showToast("Unable to generate image. Please try again.", "error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 no-print">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Today's Report</h1>
          <p className="text-ink-800/60 text-sm">Complete daily mill report — production and expenses for the selected date.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="py-2" />
          <Button variant="secondary" icon={Printer} onClick={() => window.print()}>Print</Button>
          <Button variant="secondary" icon={ImageIcon} onClick={() => handleExportImage("png")} loading={exporting}>Image</Button>
          <Button icon={Download} onClick={handleExportPDF} loading={exporting}>Export PDF</Button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <Card className="overflow-hidden">
          <ReportDocument
            title="Daily Production & Expense Report"
            subtitle={`Date: ${formatDateDisplay(date)}`}
            data={data}
          />
        </Card>
      )}
    </div>
  );
}

