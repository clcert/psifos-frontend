import React from "react";

import { useDroppable} from "@dnd-kit/core";
import {
    rectSortingStrategy,
    SortableContext,
} from "@dnd-kit/sortable";

import { RankableItem } from "./RankableItem";

function SecretMessage({ condition, message }){
    return condition &&
        <div className="ranking-secret-message">
            {message}
        </div>
};


export function SortedDroppable({
    id, items, labels,
}){
    const { setNodeRef } = useDroppable({ id })
    return (
        <SortableContext
            id={id}
            items={items}
            strategy={rectSortingStrategy}
        >
            <ul
                className="droppable"
                ref={setNodeRef}
                style={{height: "100%", width: "100%", margin:"0px", padding:"0px"}}
            >
                {items.map((item) => (
                    <RankableItem
                        key={item}
                        id={item}
                        label={labels[item-1]}
                        itemType="ranking__btn ranked"
                    />
                ))}
                <SecretMessage
                    condition={items.length === 0}
                    message="(Ordena las opciones de mayor a menor preferencia deslizándolas a esta zona)"
                />
            </ul>
        </SortableContext>
    )
}
  
export function UnsortedDroppable({
    id, items, labels,
}){
    const { setNodeRef } = useDroppable({ id });
    return (
        <SortableContext
            id={id}
            items={items}
        >
            <div
                className="droppable"
                ref={setNodeRef}
                style={{display: "flex", flexWrap: "wrap"}}
            >
                {items.map((item) => (
                    <RankableItem
                        key={item}
                        id={item}
                        label={labels[item-1]}
                    />
                ))}
                <SecretMessage
                    condition={items.length === 0}
                    message="(Todas las opciones fueron rankeadas)"
                />
            </div>
        </SortableContext>
    );
};