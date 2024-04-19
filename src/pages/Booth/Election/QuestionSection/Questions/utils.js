// RANKING
import { arrayMove as dndKitArrayMove } from "@dnd-kit/sortable";

export const removeAtIndex = (array, index) => {
    return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const insertAtIndex = (array, index, item) => {
    return [...array.slice(0, index), item, ...array.slice(index)];
};

export const arrayMove = (array, oldIndex, newIndex) => {
    return dndKitArrayMove(array, oldIndex, newIndex);
};

export const getEnumerateList = (list) => {
    return list.map((_, id) => id+1)
}