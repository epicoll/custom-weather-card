импорт { LitElement, html, ксс } от 'горит';

класс Пользовательская карта погоды расширяет LitElement {
  статический получать свойства() {
    возвращаться {
      хасс: { тип: Объект },
      конфигурация: { тип: Объект },
    };
  }

  статический получать стили() {
    возвращаться ксс`
 .погодная карта {
 ширина: 100%;
 цвет-фона: var(--цвет-фона-карты, #fff);
 радиус-границы: var(--ha-card-border-radius, 12px);
 box-shadow: var(--ha-card-box-shadow, 0 4px 12px rgba(0, 0, 0, 0.1));
 отступ: 24px;
 дисплей: гибкий;
 направление изгиба: столбец;
 зазор: 20px;
 цвет: var(--primary-text-color, #333);
 семейство шрифтов: var(-ha-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, без засечек);
      }
 .заголовок-карты {
 размер шрифта: 20px;
 начертание шрифта: жирный;
 цвет: var(--secondary-text-color, #555);
 выравнивание текста: по центру;
      }
 .основная-погода {
 дисплей: гибкий;
 обосновать содержание: пространство между;
 выровнять элементы: центр;
 нижний край: 10px;
      }
 .главная-погода-слева {
 дисплей: гибкий;
 направление изгиба: столбец;
 выравнивание элементов: гибкий старт;
      }
 .основная-погода-температура {
 размер шрифта: 48px;
 вес шрифта: 300;
      }
 .основные-погодные-ощущения {
 размер шрифта: 16px;
 цвет: var(--secondary-text-color, #777);
 верхнее поле: -5px;
      }
 .главная-погода-справа {
 дисплей: гибкий;
 направление изгиба: столбец;
 выровнять элементы: центр;
 зазор: 5px;
      }
 .главный-значок-погоды {
 ширина: 80px;
 высота: 80px;
 фильтр: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }
 .основное-описание-погоды {
 выравнивание текста: по центру;
 размер шрифта: 16px;
 цвет: var(--secondary-text-color, #777);
      }
 .другие-источники {
 border-top: 1px solid var(--divider-color, #eee);
 отступ сверху: 20px;
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
