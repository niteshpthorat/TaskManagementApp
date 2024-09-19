export const validateTask = (description: string, dueDate: Date, category: string): boolean => {
    const isDescriptionValid = description.trim() !== '' && description.length <= 100;
    const isDueDateValid = dueDate >= new Date();
    const isCategoryValid = category.trim() !== '';

    return isDescriptionValid && isDueDateValid && isCategoryValid;
};
