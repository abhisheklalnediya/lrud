interface Options {
    leading?: boolean;
    trailing?: boolean;
}
export default function throttle(func: (e: any) => void, wait: number, options?: Options): () => any;
export {};
