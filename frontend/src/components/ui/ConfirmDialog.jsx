import Modal from "./Modal.jsx";
import Button from "./Button.jsx";

export default function ConfirmDialog({ open, onCancel, onConfirm, loading, message }) {
  return (
    <Modal open={open} onClose={onCancel} title="Confirm">
      <p className="text-sm text-ink-800">{message || "Are you sure you want to delete this entry?"}</p>
      <div className="flex justify-end gap-2 mt-5">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>Delete</Button>
      </div>
    </Modal>
  );
}
