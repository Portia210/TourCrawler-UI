export const filters = (bookingJobId: string, travelorJobId: string) => [
  {
    $lookup: {
      from: "travelorhotels",
      localField: "title",
      foreignField: "title",
      as: "matchedHotels",
    },
  },
  {
    $unwind: {
      path: "$matchedHotels",
    },
  },
  {
    $match: {
      matchedHotels: { $exists: true },
      // createdAt: { $gte: new Date() },
      "matchedHotels.jobId": { $eq: travelorJobId },
      jobId: { $eq: bookingJobId },
    },
  },
  {
    $project: {
      _id: 0,
      title: 1,
      distance: "$distance",
      stars: "$stars",
      rate: "$rate",
      travelorPrice: "$matchedHotels.price.amount",
      bookingPrice: "$price.amountUnformatted",
      bookingCurrency: "$price.currency",
      travelorCurrency: "$matchedHotels.price.currency",
      travelorLink: "$matchedHotels.travelor_link",
      bookingLink: "$booking_link",
    },
  },
];
