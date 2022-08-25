# TODO
- <strike> Prendere la lista dei Portfolios non da db interno ma usando fastapi service </strike>
- Portfolios controller $url = Url::fromRoute('prjo_dap.out_infograph'); Prendere la url dalla route per evitare problemi di deploy - Visto che tutto funziona via js conviene salvare i portfolios in una sessionStorage variable e lavorare tutto da lì invece che implementare le url parametrizzate

# Drupal

- Configurazione della url di development e di produzione per il servizio fastapi

# Implementazione
Dato che anche la piattaforma drupal è dockerizzata pensavo di utilizzare il routing interno (eg. drupal <-> fastapi) per le chiamate ai servizi per cui ho guardato HTTP client.

Utilizzando però l'ip della macchina host possiamo fare le chiamate ai servizi anche da drupal container (eg. se facciamo un wget http://192.168.17.154:8008 dalla console del docker container drupal riceviamo i dati dal servizio fastapi)

## GuzzleHttp
L'ho usato per usare i servizi dalla rete interna di docker, l'idea di utilizzare le porte e i nomi interni può aver senso ma, nel nostro caso, dove le chiamate devono essere paretrizzate lato interfaccia, diventa troppo lungo da implementare.

Vedi il commit per un esempio funzionante
https://github.com/ilpise/d9m_prjo_dap/commit/0a331dcee5adc8564ca3f407f2a9fcfc8668b995

## Javascript ajax

Dopo aver testato HTTP client ritorniamo alle chiamate ajax da javascript facendo le seguenti considerazioni.

E' vero che usando HTTP client il servizio rischiesto (fastapi) è raggiungbile da container a container (eg. drupal <-> fastapi) usando i nomi interni. Ma parametrizzare le chiamate, anche usando HTTP Client Manager è troppo impegnativo. Inoltre, sulle singole pagine, le chiamate al servizio devono essere fatte quando si selezionano i nuovi parametri in interfaccia, gestirlo con HTTP client che si trova nell controller drupal diventa troppo impegnativo.

Quindi ritorniamo al vecchio approccio, ajax calls, facendo le seguenti considerazioni.

1. il servizio fastapi è esposto in rete pubblica sulla porta 8008 (su neo con la configurazione in hosts raggiungiamo il servizio usando http://localhost:8008/ oppure http://local.wp4dap_dev.it:8008/) quindi aggiungiamo un parametro di configurazione al modulo dove definiamo la url per il servizio in modo che, cambiata la macchina da development a produzione, basterà cambiare la url con la nuova url del servizio.


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

## Passing parameters to drupalSettings

Per passare i parametri dal controller in javascript
```
class Outline extends ControllerBase {

  /**
   * Returns a render-able array for a test page.
   * @wpp - Name of the waterportfolio passed in route path
   */
  // public function infograph($wpp) {
  public function infograph() {

    // dpm($wpp);
    $wpp = 'test';

    $build = [
      '#theme' => 'evaluation_outline',
      '#attached' => [
        'library' => [
          // 'prjo_dap/jQuery-contextMenu',
          // 'prjo_dap/bootstrap-multiselect',
          'prjo_dap/plotly',
          'prjo_dap/outline-infograph',
          // 'prjo_dap/charts',
        ],
        'drupalSettings' => [
          'prjo_dap' => [
              'wpp' => $wpp,
          ]
        ]

      ],
    ];
    return $build;

  }

}
```

# libraries

https://github.com/DashboardCode/BsMultiSelect
