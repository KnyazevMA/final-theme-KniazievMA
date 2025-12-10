class ProductForm {
    constructor(form) {
        this.form = form;
        this.handleSubmit = this.handleSubmit.bind(this);

        this.form.addEventListener('submit', this.handleSubmit);
    }

    async handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(this.form);

        try {
            const response = await fetch('/cart/add.js', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

        } catch (error) {
            console.error('Cart error:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ProductForm');
    if (form) new ProductForm(form);
});