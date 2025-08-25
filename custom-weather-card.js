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

    const mainEntity = this.hass.states[this.config.main_entity];
    const otherEntities = this.config.other_entities || [];

    if (!mainEntity) {
      return html`<div>Main entity not found: ${this.config.main_entity}</div>`;
    }

    const mainTemp = mainEntity.attributes.temperature;
    const mainFeelsLike = mainEntity.attributes.apparent_temperature || mainEntity.attributes.feels_like;
    const mainIcon = mainEntity.attributes.weather_icon || mainEntity.attributes.icon;
    const mainDescription = mainEntity.state;

    return html`
      <ha-card class="weather-card">
        <div class="card-header">${this.config.title || 'Сводка погоды'}</div>
        <div class="main-weather">
          <div class="main-weather-left">
            <span class="main-weather-temp">${mainTemp}°C</span>
            ${mainFeelsLike ? html`<span class="main-weather-feels">Ощущается как ${mainFeelsLike}°C</span>` : ''}
          </div>
          <div class="main-weather-right">
            <img class="main-weather-icon" src="${mainIcon}" alt="${mainDescription}">
            <span class="main-weather-description">${mainDescription}</span>
          </div>
        </div>

        ${otherEntities.length > 0 ? html`
          <div class="other-sources">
            ${otherEntities.map(entityId => {
              const entity = this.hass.states[entityId];
              if (!entity) return '';

              const temp = entity.attributes.temperature;
              const feelsLike = entity.attributes.apparent_temperature || entity.attributes.feels_like;
              const icon = entity.attributes.weather_icon || entity.attributes.icon;
              const name = entity.attributes.friendly_name || entity.entity_id;
              
              return html`
                <div class="source-item">
                  <span class="source-name">${name.split('.')[1].replace(/_/g, ' ')}</span>
                  <div class="source-data">
                    <span class="source-data-temp">${temp}°C</span>
                    ${feelsLike ? html`<span class="source-data-feels">Ощущается как ${feelsLike}°C</span>` : ''}
                  </div>
                  <img class="source-icon" src="${icon}" alt="${name}">
                </div>
              `;
            })}
          </div>
        ` : ''}
      </ha-card>
    `;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('custom-weather-card', CustomWeatherCard);
