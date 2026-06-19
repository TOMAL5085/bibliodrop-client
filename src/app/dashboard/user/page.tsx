import { TrendChart } from "@/components/charts";
import { SectionHeading } from "@/components/section-heading";
import { chartData, dashboardMetrics, deliveryHistory, userReviews } from "@/lib/site-data";

export default function UserDashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="User dashboard"
        title="Track your reading, deliveries, and reviews."
        description="Readers get a snapshot of delivery status, spending, and what has already been verified."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardMetrics.user.map((item) => (
          <div key={item.label} className="glass-panel rounded-[2rem] p-6">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-4xl font-semibold text-slate-950">{item.value}</p>
            <p className="mt-2 text-sm text-slate-600">{item.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Reading momentum</h2>
          <p className="mt-2 text-sm text-slate-600">A lightweight trend chart for quick status at a glance.</p>
          <div className="mt-6">
            <TrendChart data={chartData.userTrend} />
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Recent deliveries</h2>
          <div className="mt-6 space-y-4">
            {deliveryHistory.map((row) => (
              <div key={row.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{row.title}</p>
                    <p className="text-sm text-slate-500">{row.date}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {row.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">BDT {row.fee} spent for doorstep delivery.</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">My reading list</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {["Atlas of Light", "Paper Harbor", "Foundations of Cloud", "Orbital Lesson"].map((title) => (
              <div key={title} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-950">{title}</p>
                <p className="mt-2 text-sm text-slate-600">Successfully delivered and ready to revisit.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">My reviews</h2>
          <div className="mt-6 space-y-4">
            {userReviews.map((review) => (
              <div key={review.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-950">{review.title}</p>
                <p className="mt-1 text-sm text-slate-500">{review.date}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{review.comment}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
                  {review.rating} stars
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
