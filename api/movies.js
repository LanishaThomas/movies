let movies = [];

// helper
function send(res, status, data) {
  res.status(status).json(data);
}

export default function handler(req, res) {
  const { method, query } = req;

  // =========================
  // GET /api/movies?rating=4&operator=gt
  // =========================
  if (method === "GET") {
    let result = movies;

    const { rating, operator } = query;

    if (rating !== undefined) {
      const numRating = Number(rating);

      if (operator === "gt") {
        result = result.filter(m => m.rating > numRating);
      } 
      else if (operator === "lt") {
        result = result.filter(m => m.rating < numRating);
      } 
      else {
        // default = equal
        result = result.filter(m => m.rating == numRating);
      }
    }

    return send(res, 200, {
      success: true,
      count: result.length,
      data: result
    });
  }

  // =========================
  // POST /api/movies
  // =========================
  if (method === "POST") {
    const { title, genre, rating, recommended } = req.body;

    if (!title || !genre || rating == null || recommended == null) {
      return send(res, 400, {
        success: false,
        error: "All fields required"
      });
    }

    const newMovie = {
      id: Date.now().toString(),
      title,
      genre,
      rating: Number(rating), // ensure number
      recommended,
      createdAt: new Date()
    };

    movies.push(newMovie);

    return send(res, 201, {
      success: true,
      data: newMovie
    });
  }

  // =========================
  // PATCH /api/movies?id=123
  // =========================
  if (method === "PATCH") {
    const { id } = query;
    const movie = movies.find(m => m.id === id);

    if (!movie) {
      return send(res, 404, {
        success: false,
        error: "Movie not found"
      });
    }

    const { title, genre, rating, recommended } = req.body;

    if (title !== undefined) movie.title = title;
    if (genre !== undefined) movie.genre = genre;
    if (rating !== undefined) movie.rating = Number(rating);
    if (recommended !== undefined) movie.recommended = recommended;

    return send(res, 200, {
      success: true,
      data: movie
    });
  }

  // =========================
  // DELETE /api/movies?id=123
  // =========================
  if (method === "DELETE") {
    const { id } = query;
    const index = movies.findIndex(m => m.id === id);

    if (index === -1) {
      return send(res, 404, {
        success: false,
        error: "Movie not found"
      });
    }

    movies.splice(index, 1);

    return send(res, 200, {
      success: true,
      message: "Deleted successfully"
    });
  }

  return send(res, 405, { error: "Method not allowed" });
}