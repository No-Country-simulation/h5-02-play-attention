import { ContentCard } from "./demoVideoCard";

export function ContentGrid({ items, updateVideoProgress }) {
    return (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {items.map((item) => (
                <ContentCard key={item.id} item={item} updateVideoProgress={updateVideoProgress} />
            ))}
        </div>
    );
} 