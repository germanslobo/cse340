import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    createCategory,
    updateCategory
} from '../models/categories.js';

const validateCategoryName = (rawName) => {
    const trimmed = typeof rawName === 'string' ? rawName.trim() : '';

    if (!trimmed) {
        return { isValid: false, error: 'Category name is required.', value: trimmed };
    }
    if (trimmed.length < 3) {
        return {
            isValid: false,
            error: 'Category name must be at least 3 characters long.',
            value: trimmed
        };
    }
    if (trimmed.length > 100) {
        return {
            isValid: false,
            error: 'Category name cannot exceed 100 characters.',
            value: trimmed
        };
    }

    return { isValid: true, error: null, value: trimmed };
};

export const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', {
            title: 'Service Project Categories',
            currentYear: new Date().getFullYear(),
            categories
        });
    } catch (error) {
        console.error('Error loading categories page:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

export const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).render('404', {
                title: 'Category Not Found',
                currentYear: new Date().getFullYear()
            });
        }

        const projects = await getProjectsByCategoryId(categoryId);

        res.render('category', {
            title: category.name,
            currentYear: new Date().getFullYear(),
            category,
            projects
        });
    } catch (error) {
        console.error('Error loading category details:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

export const showNewCategoryForm = async (req, res) => {
    try {
        res.render('new-category', {
            title: 'Create New Category',
            currentYear: new Date().getFullYear(),
            name: '',
            error: null
        });
    } catch (error) {
        console.error('Error displaying new category form:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

export const processNewCategoryForm = async (req, res) => {
    try {
        const { isValid, error, value } = validateCategoryName(req.body.name);

        if (!isValid) {
            return res.status(400).render('new-category', {
                title: 'Create New Category',
                currentYear: new Date().getFullYear(),
                name: value,
                error
            });
        }

        await createCategory(value);
        res.redirect('/categories');
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

export const showEditCategoryForm = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).render('404', {
                title: 'Category Not Found',
                currentYear: new Date().getFullYear()
            });
        }

        res.render('edit-category', {
            title: `Edit ${category.name}`,
            currentYear: new Date().getFullYear(),
            category,
            error: null
        });
    } catch (error) {
        console.error('Error loading edit category form:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};

export const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    try {
        const { isValid, error, value } = validateCategoryName(req.body.name);

        if (!isValid) {
            return res.status(400).render('edit-category', {
                title: 'Edit Category',
                currentYear: new Date().getFullYear(),
                category: {
                    category_id: categoryId,
                    name: value
                },
                error
            });
        }

        await updateCategory(categoryId, value);
        res.redirect('/categories');
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).render('500', {
            title: 'Internal Server Error',
            currentYear: new Date().getFullYear()
        });
    }
};