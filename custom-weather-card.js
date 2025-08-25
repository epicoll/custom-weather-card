import { LitElement, html, css } from 'lit';

class CustomWeatherCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  static get styles() {
    return css`
      .weather-card {
        width: 100%;
        background-color: var(--card-background-color, #fff);
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: var(--ha-card-box-shadow, 0 4px 12px rgba(0, 0, 0, 0.1));
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        color: var(--primary-text-color, #333);
        font-family: var(--ha-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
      }
      .card-header {
        font-size: 20px;
        font-weight: bold;
        color: var(--secondary-text-color, #555);
        text-align: center;
      }
      .main-weather {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .main-weather-left {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .main-weather-temp {
        font-size: 48px;
        font-weight: 300;
      }
      .main-weather-feels {
        font-size: 16px;
        color: var(--secondary-text-color, #777);
        margin-top: -5px;
      }
      .main-weather-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
      }
      .main-weather-icon {
        width: 80px;
        height: 80px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }
      .main-weather-description {
        text-align: center;
        font-size: 16px;
        color: var(--secondary-text-color, #777);
      }
      .other-sources {
        border-top: 1px solid var(--divider-color, #eee);
        padding-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      .source-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .source-name {
        font-weight: 600;
        color: var(--primary-text-color, #444);
      }
      .source-data {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 5px;
        font-size: 16px;
      }
      .source-data-temp {
        font-weight: 500;
      }
      .source-data-feels {
        font-size: 12px;
        color: var(--secondary-text-color, #888);
      }
      .source-icon {
        width: 24px;
        height: 24px;
      }
    `;
  }

  render() {
    if (!this.hass || !this.config || !this.config.main_entity) {
      return html`<div>Configuration error!</div>`;
    }

    константа mainEntity = этот.хасс.состояния[этот.конфигурация.основная_сущность];
    константа другиеСубъекты = этот.конфигурация.другие_сущности || [];

    если (!mainEntity) {
      возвращаться html`<div>Основная сущность не найдена: ${этот.конфигурация.основная_сущность}</див>`;
    }

    константа mainTemp = mainEntity.атрибуты.температура;
    константа mainFeelsLike = mainEntity.атрибуты.кажущаяся_температура || mainEntity.атрибуты.чувствует_как;
    константа mainIcon = mainEntity.атрибуты.weather_icon || mainEntity.атрибуты.икона;
    константа основноеОписание = mainEntity.состояние;

    возвращаться html`
 <ha-card class= "weather-card">
 <div class= "card-header">${этот.конфигурация.заголовок || 'Сводка погоды'}</див>
 <div class= "main-weather">
 <div class= "main-weather-left">
 <span class= "main-weather-temp">${mainTemp}°C</span>
            ${mainFeelsLike ? html`<span class="main-weather-feels">Очущется как ${mainFeelsLike}°С</охватывать>` : ''}
 </див>
 <div class= "main-weather-right">
 <img class= "main-weather-icon" src="${mainIcon}" альт="${основноеОписание}">
 <span class= "основное описание погоды">${основноеОписание}</охватывать>
 </див>
 </див>

        ${другиеСубъекты.длина > 0 ? html`
 <div class="другие-источники">
            ${другиеСубъекты.карта(идентификатор сущности => {
              константа сущность = этот.хасс.состояния[идентификатор сущности];
              если (!сущность) возвращаться '';

              константа температура = сущность.атрибуты.температура;
              константа чувствует себя как = сущность.атрибуты.кажущаяся_температура || сущность.атрибуты.чувствует_как;
              константа икона = сущность.атрибуты.weather_icon || сущность.атрибуты.икона;
              константа имя = сущность.атрибуты.дружелюбное_имя || сущность.идентификатор_сущности;
              
              возвращаться html`
 <div class= "source-item">
 <span class="имя-источника">${имя.расколоть('.')[1].заменять(/_/г, ' ')}</охватывать>
 <div class="исходные-данные">
 <span class= "source-data-temp">${температура}°C</span>
                    ${чувствует себя как ? html`<span class="source-data-feels">Очущется как ${чувствует себя как}°С</охватывать>` : ''}
 </див>
 <img class= "source-icon" src="${икона}" альт="${имя}">
 </див>
              `;
            })}
 </див>
        ` : ''}
 </ха-карта>
    `;
  }

  получитьРазмерКарты() {
    возвращаться 3;
  }
}

пользовательские элементы.определять(«индивидуальная карта погоды», Пользовательская карта погоды);
