import React, { useState, useEffect } from "react";
import api from '../../api/axiosInstance'
import "./style.css"; // for mobile CSS


interface Voter {
  _id: string;
  name: string;
  houseName: string;
  genderAge: string;
  partySupport: string;
  canvassed?: boolean;
  serialNo?: number | string;
  guardianName?: string;
}

const MarkVotersMobile = () => {
  const [wards, setWards] = useState([]);
  const [party, setParty] = useState<any>([]);
  const [pollingStations, setPollingStations] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedPollingStation, setSelectedPollingStation] = useState("");
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;



  const [pendingUpdates, setPendingUpdates] = useState<{ id: string, party?: string, canvassed?: boolean }[]>([]);



  // const nextParty = (current: string): string => {
  //   if (current === "Our Party") return "Opposition";
  //   if (current === "Opposition") return "Neutral";
  //   return "Our Party";
  // };

  // const handlePartyCycle = (voterId: string) => {
  //   // 1️⃣ Update the UI immediately (cycle to next party)
  //   setData((prev: any) => {
  //     return prev.map((v: any) =>
  //       v._id === voterId
  //         ? { ...v, partySupport: nextParty(v.partySupport) }
  //         : v
  //     );
  //   });

  //   // 2️⃣ Find the voter's current record to determine the next party
  //   const voter: any = data.find((v: any) => v._id === voterId);
  //   const next = nextParty(voter?.partySupport ?? "Neutral");

  //   // 3️⃣ Update or add to pendingUpdates (avoid duplicates)
  //   setPendingUpdates((prev) => {
  //     const existingIndex = prev.findIndex((u) => u.id === voterId);

  //     if (existingIndex !== -1) {
  //       // Replace existing entry with the new party
  //       const updated = [...prev];
  //       updated[existingIndex] = { id: voterId, party: next };
  //       return updated;
  //     } else {
  //       // Add a new entry
  //       return [...prev, { id: voterId, party: next }];
  //     }
  //   });
  // };

  // 👉 Cycle through DB party list dynamically
  const nextParty = (currentId: any): any => {
    if (!party || party.length === 0) return null;

    // Find current index in the array
    const currentIndex: any = party.findIndex((p: any) => p._id === currentId);

    // If not found or last element, go back to first
    const nextIndex:any =
      currentIndex === -1 || currentIndex === party.length - 1
        ? 0
        : currentIndex + 1;

    return party[nextIndex]._id;
  };

  const handlePartyCycle = (voterId: string) => {
    // 1️⃣ Find voter and determine next party ID
    const voter: any = data.find((v: any) => v._id === voterId);
    const currentPartyId = voter?.partySupport?._id || voter?.partySupport || null;
    const nextPartyId = nextParty(currentPartyId);

    // 2️⃣ Update the UI immediately
    setData((prev: any) =>
      prev.map((v: any) =>
        v._id === voterId
          ? {
            ...v,
            partySupport:
              party.find((p: any) => p._id === nextPartyId) || v.partySupport,
          }
          : v
      )
    );

    // 3️⃣ Update or add to pendingUpdates (avoid duplicates)
    setPendingUpdates((prev: any) => {
      const existingIndex = prev.findIndex((u: any) => u.id === voterId);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = { id: voterId, party: nextPartyId };
        return updated;
      } else {
        return [...prev, { id: voterId, party: nextPartyId }];
      }
    });
  };



  const handleCanvassToggle = (voterId: string) => {
    setData((prev: any) =>
      prev.map((v: any) =>
        v._id === voterId ? { ...v, canvassed: !v.canvassed } : v
      )
    );

    setPendingUpdates((prev: any) => {
      const existingIndex = prev.findIndex((u: any) => u.id === voterId);

      if (existingIndex !== -1) {
        const updated: any = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          canvassed: !data?.find((v: any) => v._id === voterId)?.canvassed,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: voterId,
            canvassed: !data?.find((v: any) => v._id === voterId)?.canvassed,
          },
        ];
      }
    });
  };



  // Auto sync to backend every few seconds
  useEffect(() => {
    if (pendingUpdates.length === 0) return;
    const timer = setTimeout(() => {
      syncPending();
    }, 3000);
    return () => clearTimeout(timer);
  }, [pendingUpdates]);


  const syncPending = async () => {
    try {
      console.log('pendingUpdates', pendingUpdates);

      const res = await api.patch("/voters/batch-update", { updates: pendingUpdates });
      console.log(res.data.message);

      setPendingUpdates([]);
    } catch (err) {
      console.error("Batch update failed", err);
    }
  };



  useEffect(() => {
    getParties()
  }, [])


  const getParties = async () => {
    const response = await api.get("/master/parties")
    if (response.data.success) {
      console.log('responseresponseresponse',response.data);
      
      setParty(response.data.data)
      console.log('response.data.data', response.data.data);

    }
  }





  // ✅ Fetch all wards
  const fetchWards = async () => {
    try {
      const res = await api.get("/master/wards");
      if (res.data.success) setWards(res.data.data || []);
    } catch (err) {
      console.error("Error fetching wards:", err);
    }
  };

  // ✅ Fetch polling stations
  const fetchPollingStations = async (wardId: any) => {
    try {
      const res = await api.get(`/master/pollingStations?wardId=${wardId}&mode=byward`);
      if (res.data.success) setPollingStations(res.data.data || []);
    } catch (err) {
      console.error("Error fetching polling stations:", err);
    }
  };

  // ✅ Fetch voters
  const fetchVoters = async (newPage = 1) => {
    if (!selectedWard || !selectedPollingStation) {
      alert("Please select Ward and Polling Station");
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(
        `/voters/by-location?wardId=${selectedWard}&pollingStationId=${selectedPollingStation}&page=${newPage}&limit=${limit}&search=${search}`
      );
      if (res.data.success) {
        setData(res.data.data);
        setTotalPages(res.data.pagination.pages);
        setTotal(res.data.pagination.total);
        setPage(newPage);
      }
    } catch (err) {
      console.error("Error fetching voters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  useEffect(() => {
    if (selectedWard) fetchPollingStations(selectedWard);
  }, [selectedWard]);


  const [data, setData] = useState<Voter[]>([]);

  // const handlePartyCycle = (id: string) => {
  //   setData((prev: any) =>
  //     prev.map((v: any) => {
  //       if (v._id === id) {
  //         const nextIndex = (partyStates.indexOf(v.partySupport) + 1) % partyStates.length;
  //         return { ...v, partySupport: partyStates[nextIndex] };
  //       }
  //       return v;
  //     })
  //   );

  // 🔄 Optional: Send quick update to backend
  // fetch(`/api/voters/${id}`, {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ partySupport: nextState }),
  // });


  // };

  return (
    <div className="voter-list">

      <div className="row g-3 align-items-end">
        <h4>Mark Voter</h4>
        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold">Select Ward</label>
          <select
            className="form-select mobile-select"
            value={selectedWard}
            onChange={(e) => {
              setSelectedWard(e.target.value);
              setSelectedPollingStation("");
              setVoters([]);
            }}
          >
            <option value="">-- Select Ward --</option>
            {wards.map((ward: any) => (
              <option key={ward._id} value={ward._id}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold">
            Select Polling Station
          </label>
          <select
            className="form-select mobile-select"
            value={selectedPollingStation}
            onChange={(e) => setSelectedPollingStation(e.target.value)}
            disabled={!selectedWard}
          >
            <option value="">-- Select Polling Station --</option>
            {pollingStations.map((ps: any) => (
              <option key={ps._id} value={ps._id}>
                {ps.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold">Search</label>
          <div className="input-group mobile-input">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Name, Guardian, Gender/Age, House, SEC ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchVoters(1)}
            />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={() => fetchVoters(1)}
            >
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="row mt-3">

      {data.map((voter: any) => (
           <div key={voter._id} className="col-12 col-md-6 col-lg-4">
        <div key={voter._id} className="voter-card mb-3"
          style={{
            backgroundColor: voter.partySupport.color,
            borderLeft: `6px solid ${voter.partySupport.color}`,
          }}>
          <div className="voter-serial">{voter.serialNo}</div>
          <div className="voter-info">
            <div className="voter-name">{voter.name}</div>
            <div className="voter-house">{voter.guardianName}</div>
            <small>{voter.houseName}</small>
            <small className="ms-2">{voter.genderAge}</small>
          </div>
          <div className="voter-actions">
            <div
              className="party-badge"
              style={{ backgroundColor: voter.partySupport.color }}
              onClick={() => handlePartyCycle(voter._id)}
            >
              {voter.partySupport.name}
            </div>
            <button
              className={`canvass-btn ${voter.canvassed ? "yes" : "no"}`}
              onClick={() => handleCanvassToggle(voter._id)}
            >
              {voter.canvassed ? "Canvassed" : "Not Canvassed"}
            </button>
          </div>
        </div>
        </div>
      ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container mt-4">
          <button
            className="btn btn-outline-secondary"
            disabled={page === 1}
            onClick={() => fetchVoters(page - 1)}
          >
            ◀ Prev
          </button>

          <span className="page-info">
            Page {page} of {totalPages}
          </span>

          <button
            className="btn btn-outline-secondary"
            disabled={page === totalPages}
            onClick={() => fetchVoters(page + 1)}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default MarkVotersMobile;
