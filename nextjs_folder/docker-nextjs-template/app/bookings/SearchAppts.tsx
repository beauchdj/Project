"use client" 

type Props = {
    onResults?: (data: any) => void;
}

export default function SearchAppts({ onResults }: Props) {

     async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const category = (formData.get("category") || "").toString().trim();
        
        const params = new URLSearchParams();
        if (category) params.set("category", category);

        const response = await fetch(`/api/openings?${params.toString()}`,{
            method: "GET",
        });
        
        const data = await response.json();
        onResults?.(data);
        console.log(data);
    }
    
    return (
        <section className="space-y-3">
            <form
                className="flex flex-wrap items-center gap-2 bg-emerald-800/60 p-2 rounded-lg text-sm"
                onSubmit={onSubmit}
            >
                <input
                    name="category"
                    type="text"
                    placeholder="Category"
                    className="w-28 md:w-36 rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />

                <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1 rounded-md transition disabled:opacity-50"
                >
                    Search
                </button>
            </form>
            
        </section>
    )
}