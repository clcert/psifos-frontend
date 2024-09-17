import React from "react";

import { useDroppable} from "@dnd-kit/core";
import {
    rectSortingStrategy,
    SortableContext,
} from "@dnd-kit/sortable";

import { RankableItem, RankedItem } from "./RankableItem";

function SecretMessage({ hidden, message }){
    return !hidden &&
        <div className="ranking-secret-message">
            {message}
        </div>
};


export function SortedDroppable({
    id, items, labels, activeId, answerDescriptions,
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
                    <RankedItem
                        key={item}
                        id={item}
                        label={labels[item-1]}
                        dragging={activeId}
                        answerDescription={answerDescriptions[item-1]}
                    />
                ))}
                <SecretMessage
                    hidden={items.length !== 0}
                    message="(Ordena las opciones de mayor a menor preferencia deslizándolas a esta zona)"
                />
            </ul>
        </SortableContext>
    )
}
  
export function UnsortedDroppable({
    id, items, labels, activeId, answerDescriptions,
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
                        dragging={activeId}
                        answerDescription={answerDescriptions[item-1]}
                    />
                ))}
                <SecretMessage
                    hidden={items.length !== 0}
                    message="(Todas las opciones fueron rankeadas)"
                />
            </div>
        </SortableContext>
    );
};