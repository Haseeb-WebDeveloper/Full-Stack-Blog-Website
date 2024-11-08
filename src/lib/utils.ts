// Utility function to conditionally join class names
export function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
