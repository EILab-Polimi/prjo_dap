<?php

namespace Drupal\prjo_dap\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\file\Entity\File;

/**
 * Class MyForm.
 */
class UploadFileForm extends FormBase {


  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'upload_file_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form = array(
      '#attributes' => array('enctype' => 'multipart/form-data'),
    );
		$validators = array(
		  'file_validate_extensions' => array('pdf'),
		);
		$form['my_file'] = array(
			'#type' => 'managed_file',
			'#name' => 'my_file',
			'#title' => t('File *'),
			'#size' => 20,
			// '#description' => t('PDF format only'),
			// '#upload_validators' => $validators,
			// '#upload_location' => 'public://my_files/',
		);
    $form['name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Name'),
      '#description' => $this->t('Enter your fullname'),
      '#maxlength' => 64,
      '#size' => 64,
      '#weight' => '0',
    ];

    // $form['file'] = array(
    //   '#type' => 'mana',
    //   '#title' => t('Qgis project'),
    //   '#description' => t('Upload a file, allowed extensions: qgs, qgz'),
    //   // '#upload_validators' => [
    //   //   'file_validate_extensions' => ['json']
    //   // ],
    // );
    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Submit'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Display result.
    // foreach ($form_state->getValues() as $key => $value) {
    //   \Drupal::messenger()->addMessage($key . ': ' . $value);
    // }
    $fields = $form_state->getValues();

    $fileData = $form_state->getValue('my_file');
		$newFile = File::load(reset($fileData));

    // variable is an instance of Drupal\file\Entity\File class
    $options = [
      'multipart' => [
        [
          'Content-type' => 'multipart/form-data',
          'name' => 'file',
          'contents' => fopen($newFile->getFileUri(), 'r'),
          'filename' => basename($newFile->getFileUri()),
        ],
      ],
    ];

    // \Drupal::messenger()->addMessage( print_r($fields,TRUE) );
    // define the nginx host in container
    // $host = 'http://localhost:9004/php_info.php';
    $host = 'http://localhost:9004/upload.php';
    $response = \Drupal::httpClient()->post($host, $options);

    // $response = \Drupal::httpClient()->post($host, [
    //   'form_params' => [
    //     'email' => 'test@gmail.com',
    //     'name' => 'Test user',
    //     'password' => 'testpassword',
    //   ]
    // ]);

    // $response->getBody()->getContents();
    \Drupal::messenger()->addMessage($response->getBody()->getContents());

  }

}
