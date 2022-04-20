# GuzzleHttp

# Attach library

Usando la chiamata HTTP guzzle il grafico non viene renderizzato in quanto la libreria Plotly è inserita nel footer mentre il template con il grafico viene riempito prima.

Per inserire la libreria nell'Header possiamo

1. O iniettarla direttamente nel template (debole, se cambio template non funzionerà)
```
{{ attach_library('prjo_dap/plotly)}}
```

2. Oppure aggiungere `header: TRUE` nel file `libraries.yml`

```
plotly:
  version: 2.11.1
  header: TRUE
  js:
    /libraries/plotly.js/dist/plotly.min.js: {}
```      
