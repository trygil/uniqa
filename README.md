### Run

Aplikasi uniqa memisahkan aplikasi public dengan admin dengan menggunakan subdomain.
Saat ini kita menggunakan **```uni.qa```** sebagai based domain.
Maka perlu ada konfigurasi terlebih dahulu pada komputer masing-masing.  
Contoh untuk di linux setting domain file ```/etc/hosts```  ;
```
127.0.0.1   uni.qa
127.0.0.1   admin.uni.qa
```

Berikut perintah untuk menjalankan aplikasi.  

```js
adonis serve --dev --domain=uni.qa@http://127.0.0:1:3333  
```

Setelah itu Uniqa dapat diakses dengan alamat
```http://admin.uni.qa:3333/```  
untuk aplikasi administrator/staff.  

dan  

```http://uni.qa:3333/```

untuk aplikasi publik.

### Run webpack

```./node_modules/.bin/webpack --config ./webpack.config.js --mode development --watch```


### Migrations

Jalankan migrasi dengan perintah berikut

```js
adonis migration:run
```
