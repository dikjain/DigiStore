import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function SortProducts({onSort}) {

    const List = [
        {label: "Newest", field: "id", order: "desc"},
        {label: "Oldest", field: "id", order: "asc"},
        {label: "Price: Low to High", field: "price", order: "asc"},
        {label: "Price: High to Low", field: "price", order: "desc"},
    ]

    const handleSortChange = (value) => {
        const selectedSort = List.find(item => item.label === value);
        if (selectedSort) {
            onSort(selectedSort);
        }
    }

    return (
    <div>
      <Select onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] max-[800px]:w-[100px] max-[600px]:w-[40px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {List.map((item) => (
                <SelectItem key={item.label} value={item.label}>{item.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SortProducts;
