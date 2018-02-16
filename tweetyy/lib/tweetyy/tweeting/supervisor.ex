defmodule Tweetyy.Tweeting.Supervisor do
 use Supervisor

  def start_link() do
    Supervisor.start_link(__MODULE__, nil)
  end

  def init(_arg) do
    children = [
      worker(Tweetyy.Tweeting.Worker, ["$BTC"], restart: :permanent)
    ]

    supervise(children, strategy: :one_for_one)
  end
end
