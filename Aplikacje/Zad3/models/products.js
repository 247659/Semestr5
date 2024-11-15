const mongoose = require('mongoose');

const KategoriaSchema = new mongoose.Schema({
  nazwa: { type: String, required: true }
});

const Kategoria = mongoose.model('Kategoria', KategoriaSchema);
module.exports = Kategoria;

const StanZamowieniaSchema = new mongoose.Schema({
    nazwa: { type: String, required: true }
  });
  
  const StanZamowienia = mongoose.model('StanZamowienia', StanZamowieniaSchema);
  module.exports = StanZamowienia;

  const ProduktSchema = new mongoose.Schema({
    nazwa: { type: String, required: true },
    opis: { type: String },
    cenaJednostkowa: { type: Number, required: true },
    wagaJednostkowa: { type: Number, required: true },
    kategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Kategoria', required: true }
  });
  
  const Produkt = mongoose.model('Produkt', ProduktSchema);
  module.exports = Produkt;

  const ZamowienieSchema = new mongoose.Schema({
    dataZatwierdzenia: { type: Date, default: null },
    stanZamowienia: { type: mongoose.Schema.Types.ObjectId, ref: 'StanZamowienia', required: true },
    nazwaUzytkownika: { type: String, required: true },
    email: { type: String, required: true },
    numerTelefonu: { type: String, required: true },
    produkty: [
      {
        produkt: { type: mongoose.Schema.Types.ObjectId, ref: 'Produkt', required: true },
        liczbaSztuk: { type: Number, required: true, min: 1 }
      }
    ]
  });
  
  const Zamowienie = mongoose.model('Zamowienie', ZamowienieSchema);
  module.exports = Zamowienie;
  