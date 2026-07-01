const foodProducts = [
  {
    id: 1,
    title: "Hamburguesa Clásica",
    price: 8.99,
    description: "Hamburguesa de res con lechuga, tomate, cebolla y nuestra salsa especial.",
    category: "hamburguesas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f354.png",
    rating: { rate: 4.5, count: 10 },
    stock: 10
  },
  {
    id: 2,
    title: "Hamburguesa con Queso",
    price: 10.49,
    description: "Jugosa hamburguesa de res con queso cheddar derretido y vegetales frescos.",
    category: "hamburguesas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f354.png",
    rating: { rate: 4.7, count: 8 },
    stock: 8,
    discount: 15  // 15% de descuento
  },
  {
    id: 3,
    title: "Hamburguesa BBQ",
    price: 11.99,
    description: "Hamburguesa con bacon crujiente, aros de cebolla y salsa BBQ.",
    category: "hamburguesas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f354.png",
    rating: { rate: 4.8, count: 6 },
    stock: 6,
    discount: 20
  },
  {
    id: 4,
    title: "Papas Fritas Pequeñas",
    price: 2.99,
    description: "Papas fritas crujientes doradas a la perfección.",
    category: "papas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f35f.png",
    rating: { rate: 4.3, count: 20 },
    stock: 20
  },
  {
    id: 5,
    title: "Papas Fritas Grandes",
    price: 4.49,
    description: "Porción grande de papas fritas crujientes con sal marina.",
    category: "papas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f35f.png",
    rating: { rate: 4.4, count: 15 },
    stock: 15,
    discount: 10
  },
  {
    id: 6,
    title: "Papas con Queso y Bacon",
    price: 5.99,
    description: "Papas fritas cubiertas con queso fundido y trozos de bacon.",
    category: "papas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f35f.png",
    rating: { rate: 4.6, count: 7 },
    stock: 7,
    discount: 25
  },
  {
    id: 7,
    title: "Pizza Personal",
    price: 6.99,
    description: "Pizza individual de pepperoni con queso mozzarella.",
    category: "pizzas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f355.png",
    rating: { rate: 4.2, count: 12 },
    stock: 12
  },
  {
    id: 8,
    title: "Pizza Familiar",
    price: 12.99,
    description: "Pizza grande de pepperoni con ingredientes frescos.",
    category: "pizzas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f355.png",
    rating: { rate: 4.5, count: 8 },
    stock: 8,
    discount: 12
  },
  {
    id: 9,
    title: "Pizza Hawaiana",
    price: 11.49,
    description: "Pizza con jamón, piña y queso mozzarella.",
    category: "pizzas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f355.png",
    rating: { rate: 4.1, count: 5 },
    stock: 5
  },
  {
    id: 10,
    title: "Alitas de Pollo (6 piezas)",
    price: 7.49,
    description: "Alitas de pollo bañadas en salsa BBQ o picante.",
    category: "alitas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f357.png",
    rating: { rate: 4.6, count: 10 },
    stock: 10,
    discount: 20
  },
  {
    id: 11,
    title: "Alitas de Pollo (12 piezas)",
    price: 12.99,
    description: "Docena de alitas de pollo con tu salsa favorita.",
    category: "alitas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f357.png",
    rating: { rate: 4.7, count: 6 },
    stock: 6
  },
  {
    id: 12,
    title: "Alitas Picantes",
    price: 8.99,
    description: "Alitas de pollo con salsa picante estilo buffalo.",
    category: "alitas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f357.png",
    rating: { rate: 4.4, count: 8 },
    stock: 8,
    discount: 15
  },
  {
    id: 13,
    title: "Refresco de Cola",
    price: 1.99,
    description: "Refresco de cola bien frío 500ml.",
    category: "bebidas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f964.png",
    rating: { rate: 4.0, count: 30 },
    stock: 30
  },
  {
    id: 14,
    title: "Malteada de Vainilla",
    price: 3.99,
    description: "Malteada cremosa de vainilla con crema batida.",
    category: "bebidas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f964.png",
    rating: { rate: 4.8, count: 10 },
    stock: 10,
    discount: 10
  },
  {
    id: 15,
    title: "Malteada de Chocolate",
    price: 3.99,
    description: "Malteada cremosa de chocolate con crema batida.",
    category: "bebidas",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f964.png",
    rating: { rate: 4.9, count: 10 },
    stock: 10
  },
  {
    id: 16,
    title: "Helado Sundae",
    price: 2.99,
    description: "Helado de vainilla cubierto con chocolate y nueces.",
    category: "postres",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f366.png",
    rating: { rate: 4.5, count: 8 },
    stock: 8,
    discount: 30
  },
  {
    id: 17,
    title: "Pastel de Chocolate",
    price: 4.49,
    description: "Rebanada de pastel de chocolate con relleno cremoso.",
    category: "postres",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f370.png",
    rating: { rate: 4.6, count: 5 },
    stock: 5
  },
  {
    id: 18,
    title: "Combo Hamburguesa + Papas + Refresco",
    price: 12.99,
    description: "Hamburguesa clásica con papas fritas medianas y refresco.",
    category: "combos",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f354.png",
    rating: { rate: 4.7, count: 8 },
    stock: 8,
    discount: 18
  },
  {
    id: 19,
    title: "Combo Pizza + Refresco",
    price: 14.99,
    description: "Pizza personal con refresco y papas fritas.",
    category: "combos",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f355.png",
    rating: { rate: 4.3, count: 6 },
    stock: 6
  },
  {
    id: 20,
    title: "Combo Familiar",
    price: 24.99,
    description: "2 hamburguesas, papas grandes, 4 alitas y 2 refrescos.",
    category: "combos",
    image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f354.png",
    rating: { rate: 4.9, count: 4 },
    stock: 4,
    discount: 22
  }
];

export default foodProducts;