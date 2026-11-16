toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

db.run("INSERT INTO news (category, title, content, date) VALUES (?, ?, ?, ?)", 
    [category, title, content, date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, category, title, content, date });
    });
});

// 5. Получение списка избранного
app.get('/api/bookmarks', (req, res) => {
db.all("SELECT * FROM bookmarks", (err, rows) => {
if (err) return res.status(500).json({ error: err.message });
res.json(rows);
});
});

// 6. Добавление / удаление из избранного
app.post('/api/bookmarks', (req, res) => {
const { mal_id, title, image_url, score, type, year, synopsis } = req.body;

db.get("SELECT mal_id FROM bookmarks WHERE mal_id = ?", [mal_id], (err, row) => {
    if (row) {
        db.run("DELETE FROM bookmarks WHERE mal_id = ?", [mal_id], () => res.json({ status: 'removed' }));
    } else {
        db.run("INSERT INTO bookmarks (mal_id, title, image_url, score, type, year, synopsis) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [mal_id, title, image_url, score, type, year, synopsis], () => res.json({ status: 'added' }));
    }
});
});

app.listen(PORT, () => {
console.log(Сервер запущен: http://localhost:${PORT});
});