import { useCallback, useEffect, useState } from "react";
import { useToast } from "../context/ToastContext.jsx";
import { getErrorMessage } from "../services/api.js";

// Shared list/search/pagination/CRUD state for a simple resource page.
export function useCrudList(resourceApi, { limit = 20 } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [extraParams, setExtraParams] = useState({});
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await resourceApi.list({ search, page, limit, ...extraParams });
      setRows(res.data);
      setPages(res.pagination?.pages || 1);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }, [search, page, extraParams]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (data) => {
    await resourceApi.create(data);
    showToast("Saved successfully.");
    await load();
  };

  const update = async (id, data) => {
    await resourceApi.update(id, data);
    showToast("Updated successfully.");
    await load();
  };

  const remove = async (id) => {
    await resourceApi.remove(id);
    showToast("Entry deleted.");
    await load();
  };

  return {
    rows, loading, search, setSearch: (v) => { setPage(1); setSearch(v); },
    page, pages, setPage, extraParams, setExtraParams: (v) => { setPage(1); setExtraParams(v); },
    create, update, remove, reload: load,
  };
}
