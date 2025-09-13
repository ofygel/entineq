type Dict = Record<string,string>;
const ru: Dict = {
  home_choose: 'Выберите услугу',
  taxi: 'Женское такси',
  delivery: 'Доставка',
  performer: 'Исполнитель',
};
const kz: Dict = {
  home_choose: 'Қызметті таңдаңыз',
  taxi: 'Әйелдер таксиі',
  delivery: 'Жеткізу',
  performer: 'Орындаушы',
};
export function t(key: string, lang: 'ru'|'kz'='ru'){ return (lang==='kz'?kz:ru)[key] ?? key; }
