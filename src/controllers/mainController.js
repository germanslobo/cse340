export const showHomePage = (req, res) => {
    res.render('index', {
        title: 'Home',
        currentYear: new Date().getFullYear()
    });
};