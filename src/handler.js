const { nanoid } = require("nanoid");
const books = require("./books");

const addBooksHandler = (request, h) => {

    const { name, 
            year, 
            author, 
            summary, 
            publisher, 
            pageCount, 
            readPage, 
            reading,
    } = request.payload;
    
    
    
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = false;

    const newBook = {
        id, 
        name, 
        year, 
        author, 
        summary,
        publisher, 
        pageCount,
        readPage, 
        finished, 
        reading, 
        insertedAt,
        updatedAt,
    };

    books.push(newBook);

    /* This is a function to check if the book is added. */
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    
    /* This is a function to check if the name is filled or not. If the name is not filled, the server
    will return a response with status code 400. */
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    /* This is a function to check if the readPage is bigger than pageCount. If the readPage is bigger
    than pageCount, the server will return a response with status code 400. */
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    /* This is a response for the server when the book is added. */
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    } 

    
  /* A response for the server when the book is not added. */
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    
          if (books.length > 0) {
            const response = h.response({
                status: 'success',
                data: {
                  books: books.map((book) => ({
                      id: book.id,
                      name: book.name,
                      publisher: book.publisher,
                    })),
                  },    
            });
            response.code(200);
            return response;
        } 
        const response = h.response({
            status: 'success',
            data: {
              books: [],
              },    
        });
        response.code(200);
        return response;
            
};

const getBooksByIdHandler = (request, h) => {
    const { id } = request.params;

    /* Filtering the books array to find the book with the id that matches the id in the request. */
    const book = books.filter((n) => n.id === id)[0];

    /* This is a function to check if the book is found or not. If the book is found, the server will
    return a response with status code 200. */
    if (typeof book !== 'undefined') {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);

    /* This is a function to check if the name is filled or not. If the name is not filled, the server
    will return a response with status code 400. */
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    /* This is a function to check if the readPage is bigger than pageCount. If the readPage is bigger
    than pageCount, the server will return a response with status code 400. */
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    /* This is a function to check if the book is found or not. If the book is found, the server will
        return a response with status code 200. */
    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    /* This is a response for the server when the book is not found. */
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = { 
    addBooksHandler, 
    getAllBooksHandler, 
    getBooksByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};