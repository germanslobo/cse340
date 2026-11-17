import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

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
        res.status(500).render('500', { title: 'Internal Server Error' });
    }
};

export const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).render('404', { title: 'Category Not Found' });
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
        res.status(500).render('500', { title: 'Internal Server Error' });
    }
};