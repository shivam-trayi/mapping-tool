// import React from 'react';
// import Button from './Button';
// import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
// import { cn } from './utils';

// export const Pagination = ({ children }) => <nav role="navigation" aria-label="pagination">{children}</nav>;
// export const PaginationContent = ({ children }) => <ul className="flex flex-row items-center gap-1">{children}</ul>;
// export const PaginationItem = ({ children }) => <li>{children}</li>;
// export const PaginationLink = ({ onClick, isActive, children, className }) => (
//   <button
//     onClick={onClick}
//     className={cn(
//       "flex h-9 w-9 items-center justify-center rounded-md border text-sm",
//       isActive ? "bg-blue-600 text-white" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
//       className
//     )}
//   >
//     {children}
//   </button>
// );

// export const PaginationFirst = ({ onClick, className }) => (
//   <Button variant="ghost" size="sm" onClick={onClick} className={cn("h-8 w-8", className)}>
//     <ChevronsLeft className="h-4 w-4" />
//   </Button>
// );
// export const PaginationLast = ({ onClick, className }) => (
//   <Button variant="ghost" size="sm" onClick={onClick} className={cn("h-8 w-8", className)}>
//     <ChevronsRight className="h-4 w-4" />
//   </Button>
// );
// export const PaginationPrevious = ({ onClick, className }) => (
//   <Button variant="ghost" size="sm" onClick={onClick} className={cn("h-8 w-8", className)}>
//     <ChevronLeft className="h-4 w-4" />
//   </Button>
// );
// export const PaginationNext = ({ onClick, className }) => (
//   <Button variant="ghost" size="sm" onClick={onClick} className={cn("h-8 w-8", className)}>
//     <ChevronRight className="h-4 w-4" />
//   </Button>
// );
