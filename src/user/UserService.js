import moment from "moment-timezone";
import { getSortableFagots } from "./UserRepository.js";

const getTopOneFagotByDate = async (startDate, endDate) => {
  return Object.entries((await getSortableFagots(startDate, endDate)) ?? {})[
    [0]
  ];
};

export const getMonthFagot = async () => {
  const today = moment().tz("Europe/Moscow").format("YYYY-MM-DD");

  if (
    today === moment().tz("Europe/Moscow").endOf("month").format("YYYY-MM-DD")
  ) {
    const topFagot = await getTopOneFagotByDate(
      moment().tz("Europe/Moscow").startOf("month").format("YYYY-MM-DD"),
      moment().tz("Europe/Moscow").endOf("month").format("YYYY-MM-DD"),
    );
    return (
      topFagot &&
      "\nУра у нас есть ПИДОР МЕСЯЦА!!! Это:\n<@" +
        topFagot[0] +
        "> за месяц у него дырок: " +
        topFagot[1] +
        "\n"
    );
  }
};

export const getYearFagot = async () => {
  const today = moment().tz("Europe/Moscow").format("YYYY-MM-DD");

  if (
    today === moment().tz("Europe/Moscow").endOf("year").format("YYYY-MM-DD")
  ) {
    const topFagot = await getTopOneFagotByDate(
      moment().tz("Europe/Moscow").startOf("year").format("YYYY-MM-DD"),
      moment().tz("Europe/Moscow").endOf("year").format("YYYY-MM-DD"),
    );
    return (
      topFagot &&
      "\nУра у нас есть ПИДОР ГОДА!!! Это:\n<@" +
        topFagot[0] +
        "> за год у него дырок: " +
        topFagot[1] +
        "\n"
    );
  }
};
