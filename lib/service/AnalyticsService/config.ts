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
    $group: {
      _id: "$title",
      // Use $first to select the first occurrence of each title
      distance: { $first: "$distance" },
      title: { $first: "$title" },
      stars: { $first: "$stars" },
      rate: { $first: "$rate" },
      picture_link: { $first: "$matchedHotels.picture_link" },
      travelorPrice: { $first: "$matchedHotels.price.amount" },
      bookingPrice: { $first: "$price.amountUnformatted" },
      bookingCurrency: { $first: "$price.currency" },
      travelorCurrency: { $first: "$matchedHotels.price.currency" },
      travelorLink: { $first: "$matchedHotels.travelor_link" },
      bookingLink: { $first: "$booking_link" },
    },
  },
  {
    $project: {
      _id: 0,
      title: 1,
      distance: 1,
      stars: 1,
      rate: 1,
      picture_link: 1,
      travelorPrice: 1,
      bookingPrice: 1,
      bookingCurrency: 1,
      travelorCurrency: 1,
      travelorLink: 1,
      bookingLink: 1,
    },
  },
];
