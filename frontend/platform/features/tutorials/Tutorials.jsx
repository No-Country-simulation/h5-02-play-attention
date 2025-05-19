"use client";

import React, { useState, useEffect } from "react";
import { SearchBar } from "./components/SearchBar";
import { useTutorials } from "./lib/hooks/useTutorials";
import { ContentGrid } from "./components/tutorialsGrid";

/**
 * Main Tutorials component
 * Responsible for displaying and managing tutorial resources
 */
export default function Tutorials() {
  const { tutorials, isLoading, error, handleDownload, validateTutorial, updateTutorialProgress } =
    useTutorials();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTutorials, setFilteredTutorials] = useState([]);
  const [fileType, setFileType] = useState("Todos");
  const [dateSort, setDateSort] = useState("newest");

  const applyFilters = () => {
    let filtered = [...tutorials];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tutorial) =>
          tutorial.title.toLowerCase().includes(query) ||
          (tutorial.description &&
            tutorial.description.toLowerCase().includes(query))
      );
    }

    // Apply file type filter
    if (fileType !== "Todos") {
      filtered = filtered.filter(
        (tutorial) => tutorial.type.toUpperCase() === fileType
      );
    }

    // Apply date sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.rawDate || a.date);
      const dateB = new Date(b.rawDate || b.date);

      return dateSort === "newest"
        ? dateB - dateA // Newest first
        : dateA - dateB; // Oldest first
    });

    setFilteredTutorials(filtered);
  };

  // Apply filters whenever filters change
  useEffect(() => {
    applyFilters();
  }, [tutorials, searchQuery, fileType, dateSort]);

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Tutoriales
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Videos paso a paso para la instalación y uso del sistema
        </p>
      </div>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={applyFilters}
        fileType={fileType}
        onFileTypeChange={setFileType}
        dateSort={dateSort}
        onDateSortChange={setDateSort}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-40 sm:h-64">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative mb-4 text-sm sm:text-base"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : filteredTutorials.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-2">No se encontraron tutoriales</p>
          {(searchQuery || fileType !== "Todos") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFileType("Todos");
              }}
              className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <ContentGrid items={filteredTutorials} updateTutorialProgress={updateTutorialProgress} />
      )}
    </div>
  );
}
