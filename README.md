Custom Product Page (Shopify)

Цей проєкт — кастомна реалізація Product Detail Page у Shopify з нуля в рамках навчального завдання.
В основі цього проекту є тема Skeleton Theme.
Мета — побудувати PDP максимально близьку до реального продакшн-рішення, з правильною архітектурою, динамікою та оптимізацією.

⸻

Як запустити проєкт:

git clone https://github.com/KnyazevMA/final-theme-KniazievMA.git
Або CLI: gh repo clone KnyazevMA/final-theme-KniazievMA
cd final-theme-KniazievMA
npm install
npm run dev(запускає watcher TW + shopify them dev)
Після запуску тема буде доступна в браузері у режимі превʼю.

Що реалізовано:

Product Detail Page:
	•	Кастомна секція продукту (галерея, ціна, опис, варіанти)
	•	Перемикання кольорів і розмірів
	•	Оновлення сторінки без повного reload через Section Rendering API
	•	Синхронізація стану (ціна, availability, CTA)

Галерея:
	•	Зображення
	•	Sticky gallery при скролі

Availability / Inventory:
	•	Логіка на основі product.variants
	•	Стани:
	•	In stock
	•	Out of stock
	•	In stock (no tracking)
	•	Quantity left
	•	Блокування кнопки Add to Cart, якщо немає доступних варіантів

Size Guide:
	•	Реалізовано через metaobjects
	•	Підтримка різних таблиць для різних категорій
	•	Модальне вікно з керуванням через data-attributes

Reviews:
	•	Секція відгуків
	•	Рейтинг зі зірками (snippet)
	•	Дані з JSON
	•	Адаптивна верстка

CTA Banner:
	•	Full-width банер
	•	Можливість керування через адмінку
	•	Підтримка metaobject (бібліотека банерів)

Badges:
	•	Бейджі на основі product tags
	•	Приклади:
	•	Sale
	•	Low stock
	•	Highly rated
	•	New

⸻

Використані метафілди / метаобʼєкти:

    Metafields (Product)
        •	custom.size_fit
        •	custom.product_notes
        •	custom.returns_policy
        •	custom.size_guide (посилання на metaobject)

    Metaobjects
        •	Size Guide:
            - title
            - category
            - rows (relation)
        •	Size Guide Row:
            - label
            - values (list)
        •	CTA Banner:
            - image
            -title
            - text
            - button_label

⸻

Додано понад обовʼязкове:
	•	Sticky gallery при скролі
	•	Size guide через metaobjects (масштабоване рішення)
	•	Product badges на основі тегів
	•   Показ зображення варіанта при виборі кольору
	•   Product Stock Indicator 

⸻

Технології:
	•	Shopify Liquid
	•	Vanilla JavaScript (ES6)
	•	Tailwind CSS v4
	•	Shopify Metaobjects / Metafields
	•	Section Rendering API

⸻

Примітка:
Проєкт реалізовано з фокусом на:
	•	читабельність коду
	•	масштабованість