import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import { Navigation } from "./Navigation";
import { DashboardHeader } from "../dashboard/DashboardHeader";
import { MessageBox } from "@/components/ui/MessageBox";
import { useTheme } from "@/hooks/useTheme";
import { fetchQualifications } from "@/redux/slices/testing/qualificationSlice";
import type { Qualification, Question, MappingEntry } from "../../types/qualicationTypes";
import type { RootState } from "@/redux/store";

// Unique ID helper
const uid = (prefix = "q") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

const QualificationsDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector((state: RootState) => state.qualifications);

  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [mappings, setMappings] = useState<MappingEntry[]>([]);
  const [selectedQualification, setSelectedQualification] = useState<Qualification | null>(null);
  const [editingQualification, setEditingQualification] = useState<Qualification | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  const { resolvedTheme, toggleTheme } = useTheme();

  /** Debounce searchTerm */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  /** Fetch data from API whenever page or debouncedSearch changes */
  const fetchData = useCallback(() => {
    dispatch(fetchQualifications({ page: currentPage, limit: pageSize, search: debouncedSearch }) as any);
  }, [dispatch, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /** Update local state when Redux data changes */
  useEffect(() => {
    setQualifications(items);
    setIsLoadingTable(loading);
  }, [items, loading]);

  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || 0;

  /** Filter local list as fallback */
  const filteredQualifications = useMemo(
    () => qualifications.filter((q) => q.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [qualifications, searchTerm]
  );

  /** Common props to pass to subcomponents */
  const commonProps = {
    qualifications,
    setQualifications,
    mappings,
    setMappings,
    selectedQualification,
    setSelectedQualification,
    editingQualification,
    setEditingQualification,
    editingQuestion,
    setEditingQuestion,
    searchTerm,
    setSearchTerm,
    message,
    setMessage,
    isSaving,
    setIsSaving,
    isLoadingTable,
    setIsLoadingTable,
    resolvedTheme,
    toggleTheme,
    filteredQualifications,
    uid,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    pageSize,
  };

  return (
    <div
      className={`min-h-screen antialiased transition-colors ${
        resolvedTheme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* <Navigation {...commonProps} /> */}

      <main className="max-w-7xl mx-auto">
        <Outlet context={commonProps} />
      </main>

      <MessageBox message={message} onClose={() => setMessage("")} resolvedTheme={resolvedTheme} />
    </div>
  );
};

export default QualificationsDashboard;
