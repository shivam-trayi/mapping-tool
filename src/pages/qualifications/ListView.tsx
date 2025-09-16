// src/components/qualifications/ListView.tsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Search, Filter, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Pagination from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/redux/store";
import { fetchQualifications } from "@/redux/slices/Features/qualificationSlice";
import { useTheme } from "@/hooks/useTheme";

const ListView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();

  // 🔹 Redux state
  const { items, loading, pagination } = useSelector((state: RootState) => state.qualifications);

  // 🔹 Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // 🔹 Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 🔹 Fetch qualifications from API
  const fetchData = useCallback(() => {
    dispatch(fetchQualifications({ page: currentPage, limit: pageSize, search: debouncedSearch }) as any);
  }, [dispatch, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🔹 Filter fallback (local)
  const filteredQualifications = useMemo(
    () => items.filter((q) => q.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [items, searchTerm]
  );

  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || 0;

  // 🔹 Toggle active handler
  const handleToggleActive = (id: number) => {
    console.log("Toggle active for", id);
  };

  return (
    <div className="max-w-8xl mx-auto">
      <motion.div
        key="list-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6"
      >
        {/* 🔹 Search + Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 border-gray-300 transition-colors"
              />
            </div>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex space-x-3">
            <Button disabled onClick={() => navigate("/dashboard/demo-mapping")} variant="outline">
              Demo Priority Mapping
            </Button>
            <Button onClick={() => navigate("/dashboard/qualifications-mapping")} variant="outline">
              Qualifications Mapping
            </Button>
            <Button disabled onClick={() => navigate("/dashboard/create")} variant="default">
              <Plus className="w-4 h-4 mr-2" /> Create Qualifications
            </Button>
          </div>
        </div>

        {/* 🔹 Table */}
        <div
          className={cn(
            "rounded-2xl shadow-lg overflow-hidden border",
            resolvedTheme === "dark"
              ? "bg-gray-800 text-gray-200 border-gray-700"
              : "bg-white text-gray-900 border-gray-200"
          )}
        >
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead
              className={cn(
                resolvedTheme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-50 text-gray-500"
              )}
            >
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                [...Array(9)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-10 bg-gray-300 dark:bg-gray-700 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded" /></td>
                  </tr>
                ))
              ) : filteredQualifications.length > 0 ? (
                filteredQualifications.map((q, index) => (
                  <tr
                    key={q.id}
                    className={cn(resolvedTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50")}
                  >
                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                    <td className="px-6 py-4 font-medium">{q.name}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleToggleActive(q.id)}>
                        {q.active ? (
                          <ToggleRight className="w-6 h-6 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Button variant="ghost" size="sm" disabled onClick={() => navigate("/dashboard/edit")}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No qualifications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔹 Pagination */}
        {totalPages > 1 && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </motion.div>
    </div>
  );
};

export default ListView;
