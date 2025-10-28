export interface Node {
    id: number;
    name: string;
    added_by: string;
}


export interface Link {
    id: number;
    source: number;
    target: number;
    added_by: string;
}