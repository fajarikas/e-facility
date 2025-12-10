export const getBMNType = (name: string) => {
    let bmnClass: string;
    switch (name) {
        case 'Type A':
            bmnClass = 'bg-green-200 text-green-800';
            break;
        case 'Type B':
            bmnClass = 'bg-blue-200 text-blue-800';
            break;
        case 'Type C':
            bmnClass = 'bg-yellow-200 text-yellow-800';
            break;
        default:
            bmnClass = 'bg-gray-200 text-gray-800';
    }
    return bmnClass;
};
