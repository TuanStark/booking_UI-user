import { Building } from "@/types";
import BuildingCard from "./BuildingCard";


interface BuildingListProps {
    buildings: Building[]
    selectedBuildingId?: string
    onBuildingSelect?: (buildingId: string) => void
}

export default function BuildingList({ buildings, selectedBuildingId, onBuildingSelect }: BuildingListProps) {
    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((building) => (
                <div key={building.id} id={`building-${building.id}`}>
                    <BuildingCard
                        building={building}
                        onSelect={onBuildingSelect}
                        isSelected={selectedBuildingId === building?.id ? true : false}
                    />
                </div>
            ))}
        </div>
    )
}