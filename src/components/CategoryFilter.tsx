type CategoryFilterProps = {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
};

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <button
        type="button"
        className={`category-chip ${selected === null ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`category-chip ${selected === cat ? 'active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
