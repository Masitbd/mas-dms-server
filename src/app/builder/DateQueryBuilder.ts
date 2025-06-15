/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Query, FilterQuery } from "mongoose";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

class DateQueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  /**
   * Method to handle search functionality
   */
  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm as string;
    if (searchTerm && searchTerm.trim() !== "") {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            } as FilterQuery<T>)
        ),
      });
    }
    return this;
  }

  /**
   * Method to handle date filtering
   */
  applyDateFilter(): this {
    const { startDate, endDate } = this.query;

    if (startDate) {
      const start = new Date(String(startDate));
      const end = endDate ? new Date(String(endDate)) : new Date();

      start.setUTCHours(0, 0, 0, 0); // Beginning of the day
      end.setUTCHours(23, 59, 59, 999); // End of the day

      this.modelQuery = this.modelQuery.find({
        createdAt: { $gte: start, $lte: end },
      });
    }
    return this;
  }

  /**
   * Method to apply filters
   */
  applyFilters(): this {
    const queryObj = { ...this.query };

    const excludeFields = [
      "startDate",
      "endDate",
      "searchTerm",
      "page",
      "limit",
      "sort",
      "fields",
    ];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (queryObj.courseFilter) {
      const courseFilter = queryObj.courseFilter;
      delete queryObj.courseFilter;

      if (mongoose.Types.ObjectId.isValid(courseFilter as any)) {
        queryObj["courses.course"] = new mongoose.Types.ObjectId(
          courseFilter as string
        );
      } else if (Array.isArray(courseFilter)) {
        queryObj["courses.course"] = {
          $in: courseFilter
            .filter((id): id is string => mongoose.Types.ObjectId.isValid(id)) // Filter valid ObjectId strings
            .map((id) => new mongoose.Types.ObjectId(id)),
        };
      }
    }

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  /**
   * Method to sort results
   */
  applySorting(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort as string);
    return this;
  }

  /**
   * Method to paginate results
   */
  applyPagination(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 100;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  /**
   * Method to count total documents
   */
  async countTotal(): Promise<PaginationMeta> {
    const totalQueries = this.modelQuery.getFilter(); // Get the filters applied
    const total = await this.modelQuery.model.countDocuments(totalQueries); // Count total documents matching the filters
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 100;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }

  /**
   * Execute the query and return results
   */
  async execute(): Promise<T[]> {
    const results = await this.modelQuery;
    return results;
  }
}

export default DateQueryBuilder;
