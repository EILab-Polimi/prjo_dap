<?php
/**
 * @file
 * Configuration form for dab functionalities
 */
namespace Drupal\prjo_dap\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configure dab settings for this site.
 */
class DapSettingsForm extends ConfigFormBase {

  /**
   * Config settings.
   *
   * @var string
   */
  const SETTINGS = 'dap.settings';

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'dap_admin_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      static::SETTINGS,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config(static::SETTINGS);

    // We can use mosquitto name like an ip since it is resolved like the ip
    // taken from mosquitto service in the running stack
    $form['fastapi_dev_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('FastAPI development url'),
      '#default_value' => (empty($config->get('fastapi_dev_url'))) ? 'http://localhost:5000' : $config->get('fastapi_dev_url'),
    ];
    $form['fastapi_prod_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('FastAPI production url / docker'),
      '#default_value' => (empty($config->get('fastapi_prod_url'))) ? 'http://localhost:8008' : $config->get('fastapi_prod_url'),
    ];
    $form['fastapi_sel'] = array(
      '#type' => 'radios',
      '#title' => $this->t('Select Environment'),
      '#default_value' => (empty($config->get('fastapi_sel'))) ? 0 : $config->get('fastapi_sel'),
      '#options' => array(
        0 => $this->t('Development'),
        1 => $this->t('Production'),
      ),
    );

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Retrieve the configuration.
    $this->configFactory->getEditable(static::SETTINGS)
      // Set the submitted configuration setting.
      ->set('fastapi_dev_url', $form_state->getValue('fastapi_dev_url'))
      ->set('fastapi_prod_url', $form_state->getValue('fastapi_prod_url'))
      ->set('fastapi_sel', $form_state->getValue('fastapi_sel'))
      ->save();

    parent::submitForm($form, $form_state);
  }

}
