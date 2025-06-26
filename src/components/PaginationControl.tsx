// src/components/PaginationControls.tsx
type Props = {
  page: number;
  total: number;
  perPage: number;
  onPageChange: (newPage: number) => void;
};

export default function PaginationControls({ page, total, perPage, onPageChange }: Props) {
  const totalPages = Math.ceil(total / perPage);

  const renderPageNumbers = () => {
    const pages = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (
        (i === page - delta - 1 || i === page + delta + 1)
      ) {
        pages.push('...');
      }
    }

    return [...new Set(pages)].map((p, index) => {
      if (p === '...') {
        return (
          <span key={index} className="px-2 text-neutral-500">
            ...
          </span>
        );
      }

      return (
        <button
          key={index}
          onClick={() => onPageChange(p as number)}
          className={`px-3 py-1 rounded ${
            p === page
              ? 'bg-orange-500 text-white'
              : 'bg-gray-700 text-white'
          }`}
        >
          {p}
        </button>
      );
    });
  };

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-neutral-300 gap-4 flex-wrap">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
      >
        ← Anterior
      </button>

      <div className="flex gap-1">{renderPageNumbers()}</div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
      >
        Siguiente →
      </button>
    </div>
  );
}
